package com.careerbridge.controller;

import com.careerbridge.dto.JobDTO;
import com.careerbridge.security.UserDetailsImpl;
import com.careerbridge.service.CompanyService;
import com.careerbridge.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/active")
    public ResponseEntity<List<JobDTO>> getActiveJobs() {
        return ResponseEntity.ok(jobService.getActiveJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobDTO>> getJobsByCompanyId(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompanyId(companyId));
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobDTO dto, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Long companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
        return ResponseEntity.ok(jobService.createJob(dto, companyId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long id, @RequestBody JobDTO dto, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long companyId = null;
        if (!isAdmin) {
            companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
        }
        return ResponseEntity.ok(jobService.updateJob(id, dto, companyId, isAdmin));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long companyId = null;
        if (!isAdmin) {
            companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
        }
        jobService.deleteJob(id, companyId, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
