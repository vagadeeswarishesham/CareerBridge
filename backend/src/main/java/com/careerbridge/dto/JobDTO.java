package com.careerbridge.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class JobDTO {

    private Long id;
    private Long companyId;

    @NotBlank(message = "Job title is required")
    private String title;

    private String companyName;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    private String jobType;

    @NotBlank(message = "Salary package is required")
    private String salaryPackage;

    private String requiredSkills;

    @DecimalMin(value = "0.0", message = "Minimum CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10.0")
    private Double minCgpa;

    private String eligibleBranch;
    private Integer graduationYear;

    @NotBlank(message = "Deadline is required")
    private String deadline;

    private LocalDateTime postedDate;
    private boolean active = true;

    private Boolean isEligible;
    private Boolean hasApplied;
    private String applicationStatus;

    public JobDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public String getSalaryPackage() { return salaryPackage; }
    public void setSalaryPackage(String salaryPackage) { this.salaryPackage = salaryPackage; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getEligibleBranch() { return eligibleBranch; }
    public void setEligibleBranch(String eligibleBranch) { this.eligibleBranch = eligibleBranch; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Boolean getIsEligible() { return isEligible; }
    public void setIsEligible(Boolean isEligible) { this.isEligible = isEligible; }

    public Boolean getHasApplied() { return hasApplied; }
    public void setHasApplied(Boolean hasApplied) { this.hasApplied = hasApplied; }

    public String getApplicationStatus() { return applicationStatus; }
    public void setApplicationStatus(String applicationStatus) { this.applicationStatus = applicationStatus; }
}
