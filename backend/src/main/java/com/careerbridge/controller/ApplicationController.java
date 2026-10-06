package com.careerbridge.controller;

import com.careerbridge.dto.ApplicationDTO;
import com.careerbridge.dto.ApplicationStatusUpdateDTO;
import com.careerbridge.security.UserDetailsImpl;
import com.careerbridge.service.ApplicationService;
import com.careerbridge.service.CompanyService;
import com.careerbridge.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private CompanyService companyService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationDTO> applyForJob(@RequestBody Map<String, Object> request, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Long studentId = studentService.getStudentByUserId(userPrincipal.getId()).getId();
        
        Long jobId = Long.parseLong(request.get("jobId").toString());
        String resumeUrl = request.get("resumeUrl") != null ? request.get("resumeUrl").toString() : null;
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;

        return ResponseEntity.ok(applicationService.applyForJob(studentId, jobId, resumeUrl, notes));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT') or hasRole('COMPANY')")
    public ResponseEntity<List<ApplicationDTO>> getApplications(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String role = userPrincipal.getUser().getRole().name();

        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(applicationService.getAllApplications());
        } else if ("STUDENT".equals(role)) {
            Long studentId = studentService.getStudentByUserId(userPrincipal.getId()).getId();
            return ResponseEntity.ok(applicationService.getApplicationsByStudentId(studentId));
        } else if ("COMPANY".equals(role)) {
            Long companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
            return ResponseEntity.ok(applicationService.getApplicationsByCompanyId(companyId));
        }

        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT') or hasRole('COMPANY')")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudentId(studentId));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByCompanyId(@PathVariable Long companyId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCompanyId(companyId));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByJobId(@PathVariable Long jobId, Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long companyId = null;
        if (!isAdmin) {
            companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
        }
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId, companyId, isAdmin));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDTO dto,
            Authentication authentication) {
        
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long companyId = null;
        if (!isAdmin) {
            companyId = companyService.getCompanyByUserId(userPrincipal.getId()).getId();
        }
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, dto.getStatus(), dto.getNotes(), companyId, isAdmin));
    }
}
