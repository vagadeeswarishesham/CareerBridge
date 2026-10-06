package com.careerbridge.service;

import com.careerbridge.dto.CompanyDTO;
import com.careerbridge.entity.Company;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public CompanyDTO convertToDTO(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setUserId(company.getUser() != null ? company.getUser().getId() : null);
        dto.setCompanyName(company.getCompanyName());
        dto.setEmail(company.getEmail());
        dto.setPhone(company.getPhone());
        dto.setWebsite(company.getWebsite());
        dto.setIndustry(company.getIndustry());
        dto.setLocation(company.getLocation());
        dto.setDescription(company.getDescription());
        dto.setHrName(company.getHrName());
        return dto;
    }

    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return convertToDTO(company);
    }

    public CompanyDTO getCompanyByUserId(Long userId) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for user id: " + userId));
        return convertToDTO(company);
    }

    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CompanyDTO updateCompanyProfile(Long id, CompanyDTO dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        if (dto.getCompanyName() != null) company.setCompanyName(dto.getCompanyName());
        if (dto.getPhone() != null) company.setPhone(dto.getPhone());
        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        if (dto.getIndustry() != null) company.setIndustry(dto.getIndustry());
        if (dto.getLocation() != null) company.setLocation(dto.getLocation());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());
        if (dto.getHrName() != null) company.setHrName(dto.getHrName());

        Company updated = companyRepository.save(company);
        return convertToDTO(updated);
    }
}
