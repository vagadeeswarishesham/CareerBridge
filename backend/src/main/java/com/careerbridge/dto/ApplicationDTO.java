package com.careerbridge.dto;

import com.careerbridge.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentBranch;
    private Double studentCgpa;
    private Integer studentGraduationYear;
    private String studentResumeUrl;
    
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private String salaryPackage;
    
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    private String notes;
    private String resumeUrl;

    public ApplicationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public String getStudentBranch() { return studentBranch; }
    public void setStudentBranch(String studentBranch) { this.studentBranch = studentBranch; }

    public Double getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(Double studentCgpa) { this.studentCgpa = studentCgpa; }

    public Integer getStudentGraduationYear() { return studentGraduationYear; }
    public void setStudentGraduationYear(Integer studentGraduationYear) { this.studentGraduationYear = studentGraduationYear; }

    public String getStudentResumeUrl() { return studentResumeUrl; }
    public void setStudentResumeUrl(String studentResumeUrl) { this.studentResumeUrl = studentResumeUrl; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getSalaryPackage() { return salaryPackage; }
    public void setSalaryPackage(String salaryPackage) { this.salaryPackage = salaryPackage; }

    public LocalDateTime getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDateTime applicationDate) { this.applicationDate = applicationDate; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}
