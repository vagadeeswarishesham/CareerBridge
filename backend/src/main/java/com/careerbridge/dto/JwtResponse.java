package com.careerbridge.dto;

import com.careerbridge.entity.Role;

public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private Long studentId;
    private Long companyId;

    public JwtResponse(String token, Long id, String email, Role role, String fullName, Long studentId, Long companyId) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.studentId = studentId;
        this.companyId = companyId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
}
