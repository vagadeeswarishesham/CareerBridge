package com.careerbridge.dto;

import com.careerbridge.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String notes;

    public ApplicationStatusUpdateDTO() {}

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
