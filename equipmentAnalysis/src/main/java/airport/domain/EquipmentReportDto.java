package airport.domain; 

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import lombok.Data;

/**
 * 프론트엔드로 데이터를 전송하기 위한 DTO 클래스입니다.
 * 엔티티의 데이터를 프론트엔드가 원하는 형식으로 변환하는 역할을 합니다.
 */
@Data
public class EquipmentReportDto {

    // 프론트엔드가 사용하는 필드명과 일치
    private Long id;
    private String type;
    private String name;
    private String timestamp; // 프론트엔드 표시에 용이하도록 String 타입
    private Integer cost;

    /**
     * EquipmentReport 엔티티 객체를 받아서 DTO 객체로 변환하는 생성자입니다.
     * 이 곳에서 필드명 '번역'이 일어납니다.
     * @param entity 데이터베이스에서 조회한 엔티티 객체
     */
    public EquipmentReportDto(EquipmentReport entity) {
        this.id = entity.getEquipReportid(); // equipReportid -> id
        this.type = entity.getEquipmentType(); // equipmentType -> type
        this.name = entity.getEquipmentName(); // equipmentName -> name
        this.cost = entity.getMaintenanceCost(); // maintenanceCost -> cost
        
        // LocalDate를 "yyyy-MM-dd" 형식의 문자열로 변환합니다.
        if (entity.getTimestamp() != null) {
            this.timestamp = entity.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
    }
}