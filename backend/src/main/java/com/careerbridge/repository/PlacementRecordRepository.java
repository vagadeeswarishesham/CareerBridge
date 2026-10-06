package com.careerbridge.repository;

import com.careerbridge.entity.PlacementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlacementRecordRepository extends JpaRepository<PlacementRecord, Long> {
    Optional<PlacementRecord> findByStudentId(Long studentId);
    List<PlacementRecord> findByCompanyId(Long companyId);
    Boolean existsByStudentId(Long studentId);
}
