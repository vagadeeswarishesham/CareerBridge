package com.careerbridge.dto;

import jakarta.validation.constraints.*;

public class PlacementRecordDTO {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String companyName;
    private String studentName;
    private String studentEmail;
    private String branch;

    @NotNull(message = "Package amount is required")
    @Positive(message = "Package amount must be positive")
    private Double packageAmount;

    @NotBlank(message = "Placement date is required")
    private String placementDate;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    public PlacementRecordDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public Double getPackageAmount() { return packageAmount; }
    public void setPackageAmount(Double packageAmount) { this.packageAmount = packageAmount; }

    public String getPlacementDate() { return placementDate; }
    public void setPlacementDate(String placementDate) { this.placementDate = placementDate; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
