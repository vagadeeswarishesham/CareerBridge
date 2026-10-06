package com.careerbridge.service;

import com.careerbridge.dto.JwtResponse;
import com.careerbridge.dto.LoginRequest;
import com.careerbridge.dto.MessageResponse;
import com.careerbridge.dto.RegisterRequest;
import com.careerbridge.entity.Company;
import com.careerbridge.entity.Role;
import com.careerbridge.entity.Student;
import com.careerbridge.entity.User;
import com.careerbridge.exception.BadRequestException;
import com.careerbridge.exception.DuplicateResourceException;
import com.careerbridge.repository.CompanyRepository;
import com.careerbridge.repository.StudentRepository;
import com.careerbridge.repository.UserRepository;
import com.careerbridge.security.JwtUtils;
import com.careerbridge.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        Long studentId = null;
        Long companyId = null;

        if (user.getRole() == Role.STUDENT) {
            studentRepository.findByUserId(user.getId()).ifPresent(s -> {});
            Student s = studentRepository.findByUserId(user.getId()).orElse(null);
            if (s != null) studentId = s.getId();
        } else if (user.getRole() == Role.COMPANY) {
            Company c = companyRepository.findByUserId(user.getId()).orElse(null);
            if (c != null) companyId = c.getId();
        }

        return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getRole(), user.getFullName(), studentId, companyId);
    }

    @Transactional
    public MessageResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Error: Email is already in use!");
        }

        if (registerRequest.getRole() == Role.ADMIN) {
            throw new BadRequestException("Registration for ADMIN role is not permitted!");
        }

        User user = new User(
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getRole(),
                registerRequest.getFullName(),
                registerRequest.getPhone()
        );

        userRepository.save(user);

        if (registerRequest.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setName(registerRequest.getFullName());
            student.setEmail(registerRequest.getEmail());
            student.setPhone(registerRequest.getPhone());
            student.setBranch(registerRequest.getBranch() != null ? registerRequest.getBranch() : "CSE");
            student.setCgpa(registerRequest.getCgpa() != null ? registerRequest.getCgpa() : 0.0);
            student.setGraduationYear(registerRequest.getGraduationYear() != null ? registerRequest.getGraduationYear() : 2026);
            studentRepository.save(student);
        } else if (registerRequest.getRole() == Role.COMPANY) {
            Company company = new Company();
            company.setUser(user);
            company.setCompanyName(registerRequest.getCompanyName() != null ? registerRequest.getCompanyName() : registerRequest.getFullName());
            company.setEmail(registerRequest.getEmail());
            company.setPhone(registerRequest.getPhone());
            company.setHrName(registerRequest.getFullName());
            companyRepository.save(company);
        }

        return new MessageResponse("User registered successfully!");
    }
}
