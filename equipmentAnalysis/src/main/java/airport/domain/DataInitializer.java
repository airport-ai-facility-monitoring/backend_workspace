package airport.domain;

import java.time.LocalDate;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EquipmentReportRepository repository;

    @Override
    public void run(String... args) throws Exception {
        repository.deleteAll();

        // 1번 더미 데이터 생성
        EquipmentReport report1 = new EquipmentReport();
        // ID는 @GeneratedValue에 의해 자동 생성되므로 수동으로 설정하지 않습니다.
        report1.setEquipmentType("조명(시각유도)");
        report1.setEquipmentName("runway_light_1");
        report1.setTimestamp(LocalDate.of(2025, 7, 18));
        report1.setMaintenanceCost(550000);

        // 2번 더미 데이터 생성
        EquipmentReport report2 = new EquipmentReport();
        report2.setEquipmentType("기상관측");
        report2.setEquipmentName("weather_sensor_9");
        report2.setTimestamp(LocalDate.of(2025, 7, 17));
        report2.setMaintenanceCost(1200000);
        
        // 3번 더미 데이터 생성
        EquipmentReport report3 = new EquipmentReport();
        report3.setEquipmentType("표지·표시");
        report3.setEquipmentName("runway_marker_15");
        report3.setTimestamp(LocalDate.of(2025, 7, 17));
        report3.setMaintenanceCost(300000);

        // 생성된 3개의 데이터를 데이터베이스에 저장합니다.
        repository.saveAll(Arrays.asList(report1, report2, report3));

        System.out.println("==================================================");
        System.out.println("=== 3개의 더미 데이터가 성공적으로 추가되었습니다. ===");
        System.out.println("==================================================");
    }
}