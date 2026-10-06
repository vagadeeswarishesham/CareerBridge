package com.careerbridge.service;

import com.careerbridge.dto.JobDTO;
import com.careerbridge.entity.Company;
import com.careerbridge.entity.Job;
import com.careerbridge.exception.BadRequestException;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.exception.UnauthorizedException;
import com.careerbridge.repository.CompanyRepository;
import com.careerbridge.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public JobDTO convertToDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setCompanyId(job.getCompany() != null ? job.getCompany().getId() : null);
        dto.setTitle(job.getTitle());
        dto.setCompanyName(job.getCompanyName());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setJobType(job.getJobType());
        dto.setSalaryPackage(job.getSalaryPackage());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setMinCgpa(job.getMinCgpa());
        dto.setEligibleBranch(job.getEligibleBranch());
        dto.setGraduationYear(job.getGraduationYear());
        dto.setDeadline(job.getDeadline());
        dto.setPostedDate(job.getPostedDate());
        dto.setActive(job.isActive());
        return dto;
    }

    public List<JobDTO> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getActiveJobs() {
        return jobRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + id));
        return convertToDTO(job);
    }

    public List<JobDTO> getJobsByCompanyId(Long companyId) {
        return jobRepository.findByCompanyId(companyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JobDTO createJob(JobDTO dto, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        validateDeadline(dto.getDeadline());

        Job job = new Job();
        job.setCompany(company);
        job.setTitle(dto.getTitle());
        job.setCompanyName(company.getCompanyName());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setSalaryPackage(dto.getSalaryPackage());
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setMinCgpa(dto.getMinCgpa() != null ? dto.getMinCgpa() : 0.0);
        job.setEligibleBranch(dto.getEligibleBranch() != null ? dto.getEligibleBranch() : "ALL");
        job.setGraduationYear(dto.getGraduationYear() != null ? dto.getGraduationYear() : 2026);
        job.setDeadline(dto.getDeadline());
        job.setPostedDate(LocalDateTime.now());
        job.setActive(true);

        Job saved = jobRepository.save(job);
        return convertToDTO(saved);
    }

    public JobDTO updateJob(Long jobId, JobDTO dto, Long companyId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && (job.getCompany() == null || !job.getCompany().getId().equals(companyId))) {
            throw new UnauthorizedException("You can only modify your own job postings");
        }

        if (dto.getDeadline() != null) {
            validateDeadline(dto.getDeadline());
            job.setDeadline(dto.getDeadline());
        }

        if (dto.getTitle() != null) job.setTitle(dto.getTitle());
        if (dto.getDescription() != null) job.setDescription(dto.getDescription());
        if (dto.getLocation() != null) job.setLocation(dto.getLocation());
        if (dto.getJobType() != null) job.setJobType(dto.getJobType());
        if (dto.getSalaryPackage() != null) job.setSalaryPackage(dto.getSalaryPackage());
        if (dto.getRequiredSkills() != null) job.setRequiredSkills(dto.getRequiredSkills());
        if (dto.getMinCgpa() != null) job.setMinCgpa(dto.getMinCgpa());
        if (dto.getEligibleBranch() != null) job.setEligibleBranch(dto.getEligibleBranch());
        if (dto.getGraduationYear() != null) job.setGraduationYear(dto.getGraduationYear());
        job.setActive(dto.isActive());

        Job updated = jobRepository.save(job);
        return convertToDTO(updated);
    }

    public void deleteJob(Long jobId, Long companyId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!isAdmin && (job.getCompany() == null || !job.getCompany().getId().equals(companyId))) {
            throw new UnauthorizedException("You can only delete your own job postings");
        }

        jobRepository.delete(job);
    }

    private void validateDeadline(String deadline) {
        if (deadline == null || deadline.isBlank()) {
            throw new BadRequestException("Job deadline is required");
        }
        try {
            LocalDate deadlineDate = LocalDate.parse(deadline);
            if (deadlineDate.isBefore(LocalDate.now())) {
                throw new BadRequestException("Job deadline must be in the future");
            }
        } catch (Exception e) {
            if (e instanceof BadRequestException) throw e;
            // Format check fallback
        }
    }
}
