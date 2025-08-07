package airport.domain.User;

public class UserDto {

    private String employeeId;   // 마스킹된 사번
    private Long realEmployeeId;
    private String name;         // 마스킹된 이름
    private String realName;
    private String department;
    private String position;
    private String hireDate;     // "yyyy-MM" 형태
    private String phoneNumber;  // 가운데 마스킹
    private String email;        // 부분 마스킹

    // 정적 팩토리 메서드: User 엔티티에서 변환
    public UserDto (User user) {
        this.employeeId = maskEmployeeId(user.getEmployeeId() != null ? user.getEmployeeId().toString() : null);
        this.realEmployeeId = user.getEmployeeId();
        this.name = maskName(user.getName());
        this.realName = user.getName();
        this.department = user.getDepartment();
        this.position = user.getPosition();
        this.hireDate = formatHireDate(user.getHireDate());
        this.phoneNumber = maskPhone(user.getPhoneNumber());
        this.email = maskEmail(user.getEmail());
    }

    // 사번 마스킹: 길이 <=4면 전부 *, 그보다 길면 앞 4자리 * 처리
    private static String maskEmployeeId(String employeeId) {
        if (employeeId == null || employeeId.isEmpty()) return null;
        int len = employeeId.length();
        if (len <= 4) {
            return "*".repeat(len);
        } else {
            return "****" + employeeId.substring(4);
        }
    }

    // 이름: 길이 1이면 그대로, 2면 첫 글자만, 3 이상이면 첫/마지막만 보여주고 가운데 전부 *
    private static String maskName(String name) {
        if (name == null || name.isEmpty()) return null;
        int len = name.length();
        if (len == 1) return name;
        if (len == 2) {
            return name.charAt(0) + "*";
        }
        // len >= 3: 첫 + "*"*(len-2) + 마지막
        StringBuilder sb = new StringBuilder();
        sb.append(name.charAt(0));
        for (int i = 0; i < len - 2; i++) {
            sb.append("*");
        }
        sb.append(name.charAt(len - 1));
        return sb.toString();
    }

    // 입사일: yyyy-MM
    private static String formatHireDate(java.util.Date hireDate) {
        if (hireDate == null) return null;
        java.text.SimpleDateFormat fmt = new java.text.SimpleDateFormat("yyyy-MM");
        return fmt.format(hireDate);
    }

    // 전화번호: 숫자만 추출한 뒤 가운데를 마스킹 (기본: 앞 3, 뒤 4 고정)
    private static String maskPhone(String phone) {
        if (phone == null || phone.isEmpty()) return null;
        String digits = phone.replaceAll("\\D", "");
        int len = digits.length();
        if (len < 7) {
            // 너무 짧으면 중앙 절반 마스킹
            int show = Math.max(1, len / 4);
            String prefix = digits.substring(0, show);
            String suffix = digits.substring(len - show);
            String middle = "*".repeat(Math.max(0, len - show * 2));
            return prefix + middle + suffix;
        }
        String prefix = digits.substring(0, 3);
        String suffix = digits.substring(len - 4);
        return prefix + "-****-" + suffix;
    }

    // 이메일: local part 첫/마지막만 노출, 가운데 *로, 도메인 유지
    private static String maskEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        int atIdx = email.indexOf("@");
        if (atIdx <= 0) return email;
        String local = email.substring(0, atIdx);
        String domain = email.substring(atIdx);
        if (local.length() == 1) {
            return local + domain;
        } else if (local.length() == 2) {
            return local.charAt(0) + "*" + domain;
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(local.charAt(0));
            sb.append("*".repeat(Math.max(1, local.length() - 2)));
            sb.append(local.charAt(local.length() - 1));
            sb.append(domain);
            return sb.toString();
        }
    }

    // getters (setter 생략해서 읽기 전용으로 처리 가능)
    public String getEmployeeId() { return employeeId; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getPosition() { return position; }
    public String getHireDate() { return hireDate; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getEmail() { return email; }
    public Long getrealEmployeeId() {return realEmployeeId;}
    public String getrealName() {return realName;} 
}