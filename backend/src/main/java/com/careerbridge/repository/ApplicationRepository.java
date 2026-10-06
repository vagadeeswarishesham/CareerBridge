package com.careerbridge.repository;

import com.careerbridge.entity.Application;
import com.careerbridge.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobCompanyId(Long companyId);
    Boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    long countByStatus(ApplicationStatus status);
}
