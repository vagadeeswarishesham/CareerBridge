package com.careerbridge.service;

import com.careerbridge.dto.ApplicationDTO;
import com.careerbridge.dto.EligibilityResultDTO;
import com.careerbridge.entity.Application;
import com.careerbridge.entity.ApplicationStatus;
import com.careerbridge.entity.Job;
import com.careerbridge.entity.Student;
import com.careerbridge.exception.BadRequestException;
import com.careerbridge.exception.DuplicateResourceException;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.exception.UnauthorizedException;
import com.careerbridge.repository.ApplicationRepository;
import com.careerbridge.repository.JobRepository;
import com.careerbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentService studentService;

    public ApplicationDTO convertToDTO(Application app) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(app.getId());
        if (app.getStudent() != null) {
            Student s = app.getStudent();
            dto.setStudentId(s.getId());
            dto.setStudentName(s.getName());
            dto.setStudentEmail(s.getEmail());
            dto.setStudentPhone(s.getPhone());
            dto.setStudentBranch(s.getBranch());
            dto.setStudentCgpa(s.getCgpa());
            dto.setStudentGraduationYear(s.getGraduationYear());
            dto.setStudentResumeUrl(s.getResumeUrl());
        }
        if (app.getJob() != null) {
            Job j = app.getJob();
            dto.setJobId(j.getId());
            dto.setJobTitle(j.getTitle());
            dto.setCompanyName(j.getCompanyName());
            dto.setJobLocation(j.getLocation());
            dto.setSalaryPackage(j.getSalaryPackage());
        }
        dto.setApplicationDate(app.getApplicationDate());
        dto.setStatus(app.getStatus());
        dto.setNotes(app.getNotes());
        dto.setResumeUrl(app.getResumeUrl() != null ? app.getResumeUrl() : (app.getStudent() != null ? app.getStudent().getResumeUrl() : null));
        return dto;
    }

    public ApplicationDTO applyForJob(Long studentId, Long jobId, String customResumeUrl, String notes) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // 1. Check duplicate application
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new DuplicateResourceException("You have already applied for this job posting!");
        }

        // 2. Check eligibility
        EligibilityResultDTO eligibility = studentService.checkEligibility(studentId, jobId);
        if (!eligibility.isEligible()) {
            throw new BadRequestException("Not eligible to apply: " + String.join(", ", eligibility.getReasons()));
        }

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setNotes(notes);
        application.setResumeUrl(customResumeUrl != null ? customResumeUrl : student.getResumeUrl());

        Application saved = applicationRepository.save(application);
        return convertToDTO(saved);
    }

    public List<ApplicationDTO> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByCompanyId(Long companyId) {
        return applicationRepository.findByJobCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByJobId(Long jobId, Long companyId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && (job.getCompany() == null || !job.getCompany().getId().equals(companyId))) {
            throw new UnauthorizedException("You can only view applications for your own job postings");
        }

        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ApplicationDTO getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return convertToDTO(app);
    }

    public ApplicationDTO updateApplicationStatus(Long id, ApplicationStatus status, String notes, Long companyId, boolean isAdmin) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!isAdmin) {
            if (app.getJob() == null || app.getJob().getCompany() == null || !app.getJob().getCompany().getId().equals(companyId)) {
                throw new UnauthorizedException("You can only update applications for your own job postings");
            }
        }

        app.setStatus(status);
        if (notes != null && !notes.isBlank()) {
            app.setNotes(notes);
        }

        Application updated = applicationRepository.save(app);
        return convertToDTO(updated);
    }
}
