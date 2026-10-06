package com.careerbridge.service;

import com.careerbridge.dto.PlacementRecordDTO;
import com.careerbridge.dto.StatsDTO;
import com.careerbridge.entity.*;
import com.careerbridge.exception.DuplicateResourceException;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    @Autowired
    private UserRepository userRepository;

    public StatsDTO getDashboardStats() {
        StatsDTO stats = new StatsDTO();

        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long selectedStudents = applicationRepository.countByStatus(ApplicationStatus.SELECTED);

        double placementPct = totalStudents > 0 ? ((double) selectedStudents / totalStudents) * 100.0 : 0.0;
        placementPct = Math.round(placementPct * 100.0) / 100.0;

        stats.setTotalStudents(totalStudents);
        stats.setTotalCompanies(totalCompanies);
        stats.setTotalJobs(totalJobs);
        stats.setTotalApplications(totalApplications);
        stats.setSelectedStudents(selectedStudents);
        stats.setPlacementPercentage(placementPct);

        // Branch-wise stats
        List<Student> students = studentRepository.findAll();
        Map<String, Long> branchWise = students.stream()
                .collect(Collectors.groupingBy(s -> s.getBranch() != null ? s.getBranch() : "Unassigned", Collectors.counting()));
        stats.setBranchWiseStats(branchWise);

        // Company-wise placements
        List<PlacementRecord> records = placementRecordRepository.findAll();
        Map<String, Long> companyWise = records.stream()
                .collect(Collectors.groupingBy(r -> r.getCompanyName() != null ? r.getCompanyName() : "Unknown", Collectors.counting()));
        stats.setCompanyWiseStats(companyWise);

        // Package stats (Min, Max, Avg)
        DoubleSummaryStatistics pkgStats = records.stream()
                .filter(r -> r.getPackageAmount() != null)
                .mapToDouble(PlacementRecord::getPackageAmount)
                .summaryStatistics();

        Map<String, Object> pkgMap = new HashMap<>();
        if (pkgStats.getCount() > 0) {
            pkgMap.put("minPackage", Math.round(pkgStats.getMin() * 100.0) / 100.0);
            pkgMap.put("maxPackage", Math.round(pkgStats.getMax() * 100.0) / 100.0);
            pkgMap.put("avgPackage", Math.round(pkgStats.getAverage() * 100.0) / 100.0);
        } else {
            pkgMap.put("minPackage", 0.0);
            pkgMap.put("maxPackage", 0.0);
            pkgMap.put("avgPackage", 0.0);
        }
        stats.setPackageStats(pkgMap);

        return stats;
    }

    public PlacementRecordDTO convertPlacementToDTO(PlacementRecord pr) {
        PlacementRecordDTO dto = new PlacementRecordDTO();
        dto.setId(pr.getId());
        dto.setStudentId(pr.getStudent() != null ? pr.getStudent().getId() : null);
        dto.setCompanyId(pr.getCompany() != null ? pr.getCompany().getId() : null);
        dto.setJobId(pr.getJob() != null ? pr.getJob().getId() : null);
        dto.setCompanyName(pr.getCompanyName());
        dto.setStudentName(pr.getStudentName());
        dto.setStudentEmail(pr.getStudentEmail());
        dto.setBranch(pr.getBranch());
        dto.setPackageAmount(pr.getPackageAmount());
        dto.setPlacementDate(pr.getPlacementDate());
        dto.setAcademicYear(pr.getAcademicYear());
        return dto;
    }

    @Transactional
    public PlacementRecordDTO createPlacementRecord(PlacementRecordDTO dto) {
        if (placementRecordRepository.existsByStudentId(dto.getStudentId())) {
            throw new DuplicateResourceException("Placement record already exists for this student!");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + dto.getJobId()));

        PlacementRecord record = new PlacementRecord();
        record.setStudent(student);
        record.setCompany(company);
        record.setJob(job);
        record.setCompanyName(company.getCompanyName());
        record.setStudentName(student.getName());
        record.setStudentEmail(student.getEmail());
        record.setBranch(student.getBranch());
        record.setPackageAmount(dto.getPackageAmount());
        record.setPlacementDate(dto.getPlacementDate() != null ? dto.getPlacementDate() : LocalDate.now().toString());
        record.setAcademicYear(dto.getAcademicYear() != null ? dto.getAcademicYear() : "2025-2026");

        // Mark application status as SELECTED
        applicationRepository.findByStudentIdAndJobId(student.getId(), job.getId()).ifPresent(app -> {
            app.setStatus(ApplicationStatus.SELECTED);
            applicationRepository.save(app);
        });

        PlacementRecord saved = placementRecordRepository.save(record);
        return convertPlacementToDTO(saved);
    }

    public List<PlacementRecordDTO> getAllPlacementRecords() {
        return placementRecordRepository.findAll().stream()
                .map(this::convertPlacementToDTO)
                .collect(Collectors.toList());
    }

    public void deletePlacementRecord(Long id) {
        PlacementRecord record = placementRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement record not found with id: " + id));
        placementRecordRepository.delete(record);
    }

    @Transactional
    public void toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }
}
