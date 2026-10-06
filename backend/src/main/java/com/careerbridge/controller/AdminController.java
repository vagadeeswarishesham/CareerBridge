package com.careerbridge.controller;

import com.careerbridge.dto.*;
import com.careerbridge.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/placements")
    public ResponseEntity<List<PlacementRecordDTO>> getAllPlacements() {
        return ResponseEntity.ok(adminService.getAllPlacementRecords());
    }

    @PostMapping("/placements")
    public ResponseEntity<PlacementRecordDTO> createPlacement(@Valid @RequestBody PlacementRecordDTO dto) {
        return ResponseEntity.ok(adminService.createPlacementRecord(dto));
    }

    @DeleteMapping("/placements/{id}")
    public ResponseEntity<Void> deletePlacement(@PathVariable Long id) {
        adminService.deletePlacementRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getPlacementReports() {
        StatsDTO stats = adminService.getDashboardStats();
        Map<String, Object> reports = Map.of(
            "summary", stats,
            "branchWise", stats.getBranchWiseStats(),
            "companyWise", stats.getCompanyWiseStats(),
            "packageStats", stats.getPackageStats(),
            "placements", adminService.getAllPlacementRecords()
        );
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/users/{userId}/toggle")
    public ResponseEntity<MessageResponse> toggleUserStatus(@PathVariable Long userId, @RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        adminService.toggleUserStatus(userId, enabled);
        return ResponseEntity.ok(new MessageResponse("User status updated successfully to: " + (enabled ? "ENABLED" : "DISABLED")));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
