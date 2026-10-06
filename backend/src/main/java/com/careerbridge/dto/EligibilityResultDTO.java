package com.careerbridge.dto;

import java.util.List;

public class EligibilityResultDTO {

    private boolean eligible;
    private List<String> reasons;
    private boolean cgpaValid;
    private boolean branchValid;
    private boolean gradYearValid;
    private boolean deadlineValid;

    public EligibilityResultDTO() {}

    public EligibilityResultDTO(boolean eligible, List<String> reasons, boolean cgpaValid, boolean branchValid, boolean gradYearValid, boolean deadlineValid) {
        this.eligible = eligible;
        this.reasons = reasons;
        this.cgpaValid = cgpaValid;
        this.branchValid = branchValid;
        this.gradYearValid = gradYearValid;
        this.deadlineValid = deadlineValid;
    }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public boolean isCgpaValid() { return cgpaValid; }
    public void setCgpaValid(boolean cgpaValid) { this.cgpaValid = cgpaValid; }

    public boolean isBranchValid() { return branchValid; }
    public void setBranchValid(boolean branchValid) { this.branchValid = branchValid; }

    public boolean isGradYearValid() { return gradYearValid; }
    public void setGradYearValid(boolean gradYearValid) { this.gradYearValid = gradYearValid; }

    public boolean isDeadlineValid() { return deadlineValid; }
    public void setDeadlineValid(boolean deadlineValid) { this.deadlineValid = deadlineValid; }
}
