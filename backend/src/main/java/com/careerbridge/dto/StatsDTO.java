package com.careerbridge.dto;

import java.util.Map;

public class StatsDTO {

    private long totalStudents;
    private long totalCompanies;
    private long totalJobs;
    private long totalApplications;
    private long selectedStudents;
    private double placementPercentage;
    
    private Map<String, Long> branchWiseStats;
    private Map<String, Long> companyWiseStats;
    private Map<String, Object> packageStats;

    public StatsDTO() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getSelectedStudents() { return selectedStudents; }
    public void setSelectedStudents(long selectedStudents) { this.selectedStudents = selectedStudents; }

    public double getPlacementPercentage() { return placementPercentage; }
    public void setPlacementPercentage(double placementPercentage) { this.placementPercentage = placementPercentage; }

    public Map<String, Long> getBranchWiseStats() { return branchWiseStats; }
    public void setBranchWiseStats(Map<String, Long> branchWiseStats) { this.branchWiseStats = branchWiseStats; }

    public Map<String, Long> getCompanyWiseStats() { return companyWiseStats; }
    public void setCompanyWiseStats(Map<String, Long> companyWiseStats) { this.companyWiseStats = companyWiseStats; }

    public Map<String, Object> getPackageStats() { return packageStats; }
    public void setPackageStats(Map<String, Object> packageStats) { this.packageStats = packageStats; }
}
