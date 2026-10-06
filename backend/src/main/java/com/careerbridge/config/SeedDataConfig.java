package com.careerbridge.config;

import com.careerbridge.entity.*;
import com.careerbridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.*;

@Configuration
public class SeedDataConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PlacementRecordRepository placementRecordRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() > 0) {
                System.out.println("Seed data already present. Skipping initialization.");
                return;
            }

            System.out.println("Seeding CareerBridge initial database records...");

            // 1. Create Admin
            User adminUser = new User("admin@example.com", encoder.encode("Admin@123"), Role.ADMIN, "System Administrator", "9876543210");
            userRepository.save(adminUser);

            // 2. Seed Primary Student & Primary Company
            User mainStudentUser = new User("student@example.com", encoder.encode("Student@123"), Role.STUDENT, "Rahul Sharma", "9876543211");
            userRepository.save(mainStudentUser);

            Student mainStudent = new Student();
            mainStudent.setUser(mainStudentUser);
            mainStudent.setName("Rahul Sharma");
            mainStudent.setEmail("student@example.com");
            mainStudent.setPhone("9876543211");
            mainStudent.setDob("2002-05-15");
            mainStudent.setGender("Male");
            mainStudent.setAddress("Bangalore, Karnataka");
            mainStudent.setBranch("CSE");
            mainStudent.setCgpa(8.9);
            mainStudent.setSkills("Java, Spring Boot, React, MySQL, Data Structures");
            mainStudent.setResumeUrl("https://careerbridge.edu/resumes/rahul_sharma.pdf");
            mainStudent.setGraduationYear(2026);
            studentRepository.save(mainStudent);

            User mainCompanyUser = new User("company@example.com", encoder.encode("Company@123"), Role.COMPANY, "Tech Corp", "9876543212");
            userRepository.save(mainCompanyUser);

            Company mainCompany = new Company();
            mainCompany.setUser(mainCompanyUser);
            mainCompany.setCompanyName("Tech Corp");
            mainCompany.setEmail("company@example.com");
            mainCompany.setPhone("9876543212");
            mainCompany.setWebsite("https://techcorp.com");
            mainCompany.setIndustry("Software & Information Technology");
            mainCompany.setLocation("Hyderabad");
            mainCompany.setDescription("Leading enterprise software solution provider specializing in cloud technologies.");
            mainCompany.setHrName("Anita Verma");
            companyRepository.save(mainCompany);

            // 3. Seed 10+ Additional Students across branches
            String[][] studentRawData = {
                {"Priya Patel", "priya.p@example.com", "9812345671", "CSE", "9.2", "Java, Python, AI/ML, PyTorch", "Female", "Mumbai"},
                {"Amit Kumar", "amit.k@example.com", "9812345672", "ECE", "8.1", "Embedded Systems, C++, Verilog, IoT", "Male", "Delhi"},
                {"Sneha Reddy", "sneha.r@example.com", "9812345673", "IT", "8.7", "React, Node.js, MongoDB, TypeScript", "Female", "Hyderabad"},
                {"Vikas Verma", "vikas.v@example.com", "9812345674", "ME", "7.6", "AutoCAD, SolidWorks, Thermodynamics", "Male", "Pune"},
                {"Ananya Das", "ananya.d@example.com", "9812345675", "CSE", "9.5", "Algorithms, Java, Cloud Computing, AWS", "Female", "Kolkata"},
                {"Rohan Singh", "rohan.s@example.com", "9812345676", "CE", "7.4", "Structural Engineering, STAAD Pro", "Male", "Jaipur"},
                {"Kavya Nair", "kavya.n@example.com", "9812345677", "ECE", "8.4", "VLSI, Digital Signal Processing, Python", "Female", "Kochi"},
                {"Siddharth Joshi", "siddharth.j@example.com", "9812345678", "IT", "8.8", "Fullstack Web Dev, Docker, Kubernetes", "Male", "Ahmedabad"},
                {"Pooja Hegde", "pooja.h@example.com", "9812345679", "CSE", "8.3", "Cybersecurity, Ethical Hacking, Linux", "Female", "Chennai"},
                {"Manish Gupta", "manish.g@example.com", "9812345680", "EE", "7.9", "Power Systems, MATLAB, Microcontrollers", "Male", "Lucknow"}
            };

            List<Student> seededStudents = new ArrayList<>();
            seededStudents.add(mainStudent);

            for (String[] sData : studentRawData) {
                User u = new User(sData[1], encoder.encode("Student@123"), Role.STUDENT, sData[0], sData[2]);
                userRepository.save(u);

                Student s = new Student();
                s.setUser(u);
                s.setName(sData[0]);
                s.setEmail(sData[1]);
                s.setPhone(sData[2]);
                s.setBranch(sData[3]);
                s.setCgpa(Double.parseDouble(sData[4]));
                s.setSkills(sData[5]);
                s.setGender(sData[6]);
                s.setAddress(sData[7]);
                s.setDob("2002-08-20");
                s.setGraduationYear(2026);
                s.setResumeUrl("https://careerbridge.edu/resumes/" + sData[0].toLowerCase().replace(" ", "_") + ".pdf");
                studentRepository.save(s);
                seededStudents.add(s);
            }

            // 4. Seed 4 Additional Companies (Total 5)
            String[][] companyRawData = {
                {"Google India", "careers@google.com", "9898980001", "https://google.com", "Technology & Search", "Bangalore", "Global leader in technology, search engines, cloud computing, and AI.", "Sundar R"},
                {"Microsoft Corp", "recruitment@microsoft.com", "9898980002", "https://microsoft.com", "Software & Cloud", "Hyderabad", "Empowering every person and organization on the planet to achieve more.", "Satya N"},
                {"Tata Consultancy Services", "campus@tcs.com", "9898980003", "https://tcs.com", "IT Services & Consulting", "Mumbai", "Global leader in IT services, consulting, and business solutions.", "Rajesh G"},
                {"Infosys Technologies", "talent@infosys.com", "9898980004", "https://infosys.com", "IT Consulting", "Bangalore", "Next-generation digital services and consulting leader.", "Nandan N"}
            };

            List<Company> seededCompanies = new ArrayList<>();
            seededCompanies.add(mainCompany);

            for (String[] cData : companyRawData) {
                User u = new User(cData[1], encoder.encode("Company@123"), Role.COMPANY, cData[0], cData[2]);
                userRepository.save(u);

                Company c = new Company();
                c.setUser(u);
                c.setCompanyName(cData[0]);
                c.setEmail(cData[1]);
                c.setPhone(cData[2]);
                c.setWebsite(cData[3]);
                c.setIndustry(cData[4]);
                c.setLocation(cData[5]);
                c.setDescription(cData[6]);
                c.setHrName(cData[7]);
                companyRepository.save(c);
                seededCompanies.add(c);
            }

            // 5. Seed 10+ Jobs
            List<Job> seededJobs = new ArrayList<>();

            Object[][] jobRawData = {
                {seededCompanies.get(0), "Software Development Engineer (SDE-1)", "Full-stack developer role with focus on Spring Boot & React microservices.", "Hyderabad", "FULL_TIME", "14.5 LPA", "Java, Spring Boot, React, SQL", 7.5, "CSE, IT", 2026, "2026-11-30"},
                {seededCompanies.get(0), "Frontend Developer Intern", "Build modern UI components using React and TypeScript.", "Hyderabad", "INTERNSHIP", "35,000 / month", "HTML, CSS, JavaScript, React", 7.0, "ALL", 2026, "2026-10-25"},
                {seededCompanies.get(1), "Software Engineer - Cloud & AI", "Develop scalable backend services for Google Cloud Platform.", "Bangalore", "FULL_TIME", "28.0 LPA", "Java, Python, C++, Distributed Systems", 8.5, "CSE, IT, ECE", 2026, "2026-12-15"},
                {seededCompanies.get(1), "Data Scientist Associate", "Work on Machine Learning models and Large Language Models.", "Bangalore", "FULL_TIME", "24.0 LPA", "Python, TensorFlow, PyTorch, SQL", 8.0, "CSE, IT", 2026, "2026-11-20"},
                {seededCompanies.get(2), "System Engineer - Azure", "Architect resilient enterprise backend microservices on Azure.", "Hyderabad", "FULL_TIME", "22.5 LPA", "C#, .NET Core, Azure, Microservices", 8.0, "CSE, IT, ECE", 2026, "2026-11-15"},
                {seededCompanies.get(2), "Security Engineer", "Identify vulnerabilities and strengthen cloud infrastructure security.", "Hyderabad", "FULL_TIME", "18.0 LPA", "Cybersecurity, Networking, Linux, Python", 7.5, "CSE, IT", 2026, "2026-10-31"},
                {seededCompanies.get(3), "Assistant System Engineer", "Join TCS Digital profile for cutting-edge digital transformations.", "Mumbai", "FULL_TIME", "9.0 LPA", "Java, Python, Web Development, SQL", 6.5, "ALL", 2026, "2026-12-31"},
                {seededCompanies.get(3), "Embedded Systems Engineer", "Hardware programming, microcontrollers, and IoT sensor integration.", "Pune", "FULL_TIME", "8.5 LPA", "C, C++, Embedded C, Microcontrollers", 7.0, "ECE, EE", 2026, "2026-11-10"},
                {seededCompanies.get(4), "Specialist Programmer", "High-performance coding and complex algorithmic problem solving.", "Bangalore", "FULL_TIME", "9.5 LPA", "Data Structures, Algorithms, C++, Java", 7.5, "CSE, IT, ECE", 2026, "2026-12-05"},
                {seededCompanies.get(4), "Systems Associate", "Enterprise application maintenance and agile software testing.", "Chennai", "FULL_TIME", "6.5 LPA", "Java, SQL, Agile Methodologies", 6.0, "ALL", 2026, "2026-11-28"}
            };

            for (Object[] jData : jobRawData) {
                Company comp = (Company) jData[0];
                Job j = new Job();
                j.setCompany(comp);
                j.setCompanyName(comp.getCompanyName());
                j.setTitle((String) jData[1]);
                j.setDescription((String) jData[2]);
                j.setLocation((String) jData[3]);
                j.setJobType((String) jData[4]);
                j.setSalaryPackage((String) jData[5]);
                j.setRequiredSkills((String) jData[6]);
                j.setMinCgpa((Double) jData[7]);
                j.setEligibleBranch((String) jData[8]);
                j.setGraduationYear((Integer) jData[9]);
                j.setDeadline((String) jData[10]);
                j.setPostedDate(LocalDateTime.now().minusDays((long) (Math.random() * 10)));
                j.setActive(true);
                jobRepository.save(j);
                seededJobs.add(j);
            }

            // 6. Seed 20+ Applications in Mixed Statuses
            ApplicationStatus[] statuses = {
                ApplicationStatus.APPLIED, ApplicationStatus.UNDER_REVIEW, 
                ApplicationStatus.SHORTLISTED, ApplicationStatus.SELECTED, ApplicationStatus.REJECTED
            };

            int appCount = 0;
            for (Student student : seededStudents) {
                for (Job job : seededJobs) {
                    // Apply to 2-3 jobs per student
                    if ((student.getId() + job.getId()) % 3 == 0) {
                        Application app = new Application();
                        app.setStudent(student);
                        app.setJob(job);
                        app.setApplicationDate(LocalDateTime.now().minusDays((long) (Math.random() * 15)));
                        
                        ApplicationStatus st = statuses[(int) ((student.getId() + job.getId()) % statuses.length)];
                        app.setStatus(st);
                        app.setNotes("Application reviewed by HR team.");
                        app.setResumeUrl(student.getResumeUrl());
                        applicationRepository.save(app);
                        appCount++;
                    }
                }
            }
            System.out.println("Seeded " + appCount + " applications.");

            // 7. Seed Placement Records for Selected Students
            Student topStudent1 = seededStudents.get(1); // Priya Patel
            Job topJob1 = seededJobs.get(2); // Google Cloud Engineer
            PlacementRecord pr1 = new PlacementRecord();
            pr1.setStudent(topStudent1);
            pr1.setCompany(topJob1.getCompany());
            pr1.setJob(topJob1);
            pr1.setCompanyName(topJob1.getCompanyName());
            pr1.setStudentName(topStudent1.getName());
            pr1.setStudentEmail(topStudent1.getEmail());
            pr1.setBranch(topStudent1.getBranch());
            pr1.setPackageAmount(28.0);
            pr1.setPlacementDate("2026-09-15");
            pr1.setAcademicYear("2025-2026");
            placementRecordRepository.save(pr1);

            Student topStudent2 = seededStudents.get(5); // Ananya Das
            Job topJob2 = seededJobs.get(3); // Google Data Scientist
            PlacementRecord pr2 = new PlacementRecord();
            pr2.setStudent(topStudent2);
            pr2.setCompany(topJob2.getCompany());
            pr2.setJob(topJob2);
            pr2.setCompanyName(topJob2.getCompanyName());
            pr2.setStudentName(topStudent2.getName());
            pr2.setStudentEmail(topStudent2.getEmail());
            pr2.setBranch(topStudent2.getBranch());
            pr2.setPackageAmount(24.0);
            pr2.setPlacementDate("2026-09-20");
            pr2.setAcademicYear("2025-2026");
            placementRecordRepository.save(pr2);

            Student topStudent3 = seededStudents.get(8); // Siddharth Joshi
            Job topJob3 = seededJobs.get(4); // Microsoft System Engineer
            PlacementRecord pr3 = new PlacementRecord();
            pr3.setStudent(topStudent3);
            pr3.setCompany(topJob3.getCompany());
            pr3.setJob(topJob3);
            pr3.setCompanyName(topJob3.getCompanyName());
            pr3.setStudentName(topStudent3.getName());
            pr3.setStudentEmail(topStudent3.getEmail());
            pr3.setBranch(topStudent3.getBranch());
            pr3.setPackageAmount(22.5);
            pr3.setPlacementDate("2026-09-25");
            pr3.setAcademicYear("2025-2026");
            placementRecordRepository.save(pr3);

            System.out.println("CareerBridge database seeding completed successfully!");
        };
    }
}
