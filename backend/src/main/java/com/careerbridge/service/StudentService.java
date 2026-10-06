package com.careerbridge.service;

import com.careerbridge.dto.EligibilityResultDTO;
import com.careerbridge.dto.StudentDTO;
import com.careerbridge.entity.Job;
import com.careerbridge.entity.Student;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.repository.JobRepository;
import com.careerbridge.repository.PlacementRecordRepository;
import com.careerbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    public StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setUserId(student.getUser() != null ? student.getUser().getId() : null);
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setDob(student.getDob());
        dto.setGender(student.getGender());
        dto.setAddress(student.getAddress());
        dto.setBranch(student.getBranch());
        dto.setCgpa(student.getCgpa());
        dto.setSkills(student.getSkills());
        dto.setResumeUrl(student.getResumeUrl());
        dto.setGraduationYear(student.getGraduationYear());
        dto.setIsPlaced(placementRecordRepository.existsByStudentId(student.getId()));
        return dto;
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDTO(student);
    }

    public StudentDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return convertToDTO(student);
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO updateStudentProfile(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (dto.getName() != null) student.setName(dto.getName());
        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getDob() != null) student.setDob(dto.getDob());
        if (dto.getGender() != null) student.setGender(dto.getGender());
        if (dto.getAddress() != null) student.setAddress(dto.getAddress());
        if (dto.getBranch() != null) student.setBranch(dto.getBranch());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getSkills() != null) student.setSkills(dto.getSkills());
        if (dto.getResumeUrl() != null) student.setResumeUrl(dto.getResumeUrl());
        if (dto.getGraduationYear() != null) student.setGraduationYear(dto.getGraduationYear());

        Student updated = studentRepository.save(student);
        return convertToDTO(updated);
    }

    public EligibilityResultDTO checkEligibility(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        List<String> reasons = new ArrayList<>();
        boolean cgpaValid = true;
        boolean branchValid = true;
        boolean gradYearValid = true;
        boolean deadlineValid = true;

        // 1. CGPA check
        if (job.getMinCgpa() != null && student.getCgpa() != null && student.getCgpa() < job.getMinCgpa()) {
            cgpaValid = false;
            reasons.add(String.format("CGPA requirement not met: Your CGPA (%.2f) is below required (%.2f)", student.getCgpa(), job.getMinCgpa()));
        }

        // 2. Branch check
        if (job.getEligibleBranch() != null && !job.getEligibleBranch().equalsIgnoreCase("ALL") && !job.getEligibleBranch().equalsIgnoreCase("Any")) {
            String studentBranch = student.getBranch() != null ? student.getBranch().trim().toUpperCase() : "";
            String[] allowedBranches = job.getEligibleBranch().split(",");
            boolean matchFound = false;
            for (String b : allowedBranches) {
                if (b.trim().equalsIgnoreCase(studentBranch) || b.trim().equalsIgnoreCase("ALL")) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                branchValid = false;
                reasons.add("Branch requirement not met: Eligible branches are " + job.getEligibleBranch());
            }
        }

        // 3. Graduation Year check
        if (job.getGraduationYear() != null && job.getGraduationYear() > 0 && student.getGraduationYear() != null) {
            if (!job.getGraduationYear().equals(student.getGraduationYear())) {
                gradYearValid = false;
                reasons.add(String.format("Graduation year mismatch: Required %d, yours is %d", job.getGraduationYear(), student.getGraduationYear()));
            }
        }

        // 4. Deadline check
        if (job.getDeadline() != null && !job.getDeadline().isBlank()) {
            try {
                LocalDate deadlineDate = LocalDate.parse(job.getDeadline());
                if (deadlineDate.isBefore(LocalDate.now())) {
                    deadlineValid = false;
                    reasons.add("Application deadline has passed (" + job.getDeadline() + ")");
                }
            } catch (Exception e) {
                // Ignore parse errors or accept string format
            }
        }

        boolean eligible = cgpaValid && branchValid && gradYearValid && deadlineValid;
        if (eligible) {
            reasons.add("Congratulations! You are eligible for this job posting.");
        }

        return new EligibilityResultDTO(eligible, reasons, cgpaValid, branchValid, gradYearValid, deadlineValid);
    }
}
