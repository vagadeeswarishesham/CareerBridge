package com.careerbridge.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "placement_records")
public class PlacementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false, unique = true)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "job_id", referencedColumnName = "id", nullable = false)
    private Job job;

    private String companyName;
    private String studentName;
    private String studentEmail;
    private String branch;
    private Double packageAmount; // e.g. in LPA (12.5)
    private String placementDate;
    private String academicYear;

    public PlacementRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

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
