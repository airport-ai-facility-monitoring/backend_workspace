package airport.domain;

import airport.AlertApplication;
import airport.domain.AlertSent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Alert_table",  schema = "alert")
@Data
//<<< DDD / Aggregate Root
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long alertId;

    private String alertLog;

    private Date alertDate;

    public static AlertRepository repository() {
        AlertRepository alertRepository = AlertApplication.applicationContext.getBean(
            AlertRepository.class
        );
        return alertRepository;
    }

    //<<< Clean Arch / Port Method
    public static void sendAlert(DangerDetected dangerDetected) {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        cctvRepository
            .findById(dangerDetected.getCctvId())
            .ifPresent(cctv -> {
                Alert alert = new Alert();
                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    "FOD 감지"
                );
                alert.setAlertDate(new Date());
                repository().save(alert);

                System.out.println("##### alert log : " + alert.getAlertLog());

                // 새로운 알림이 생성될 때 SSE로 전송
                airport.domain.alertapi.AlertController alertController = airport.AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                alertController.sendNewAlert(alert);

                AlertSent alertSent = new AlertSent(alert);
                alertSent.publishAfterCommit();
            });
    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public static void sendAlert(WorkerCountExceeded workerCountExceeded) {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        cctvRepository
            .findById(workerCountExceeded.getCctvId())
            .ifPresent(cctv -> {
                Alert alert = new Alert();
                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    "작업자 수 초과"
                );
                alert.setAlertDate(new Date());
                repository().save(alert);

                System.out.println("##### alert log : " + alert.getAlertLog());

                // 새로운 알림이 생성될 때 SSE로 전송
                airport.domain.alertapi.AlertController alertController = airport.AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                alertController.sendNewAlert(alert);

                AlertSent alertSent = new AlertSent(alert);
                alertSent.publishAfterCommit();
            });
    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public static void sendAlert(WorkTimeNotMatched workTimeNotMatched) {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        cctvRepository
            .findById(workTimeNotMatched.getCctvId())
            .ifPresent(cctv -> {
                Alert alert = new Alert();
                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    "작업 시간 불일치"
                );
                alert.setAlertDate(new Date());
                repository().save(alert);

                System.out.println("##### alert log : " + alert.getAlertLog());

                // 새로운 알림이 생성될 때 SSE로 전송
                airport.domain.alertapi.AlertController alertController = airport.AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                alertController.sendNewAlert(alert);

                AlertSent alertSent = new AlertSent(alert);
                alertSent.publishAfterCommit();
            });
    }

    //>>> Clean Arch / Port Method
    

    public static void sendAlert(ForeignObjectDetected foreignObjectDetected) {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        Long cctvId = foreignObjectDetected.getCameraId();
        if (cctvId == null) {
            System.err.println("ForeignObjectDetected: cameraId is null. Cannot find CCTV.");
            return;
        }
        cctvRepository
            .findById(cctvId)
            .ifPresent(cctv -> {
                Alert alert = new Alert();
                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    "이물질 감지: " + foreignObjectDetected.getObjectType() + " " + foreignObjectDetected.getObjectCount() + "개"
                );
                alert.setAlertDate(new Date());
                repository().save(alert);

                System.out.println("##### alert log : " + alert.getAlertLog());

                // 새로운 알림이 생성될 때 SSE로 전송
                airport.domain.alertapi.AlertController alertController = airport.AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                alertController.sendNewAlert(alert);

                AlertSent alertSent = new AlertSent(alert);
                alertSent.publishAfterCommit();
            });
    }

    public static void sendAlert(WorkNotInProgress workNotInProgress) {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        cctvRepository
            .findById(workNotInProgress.getCameraId())
            .ifPresent(cctv -> {
                Alert alert = new Alert();
                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    "비작업 시간 활동 감지: " + workNotInProgress.getObjectType()
                );
                alert.setAlertDate(new Date());
                repository().save(alert);

                System.out.println("##### alert log : " + alert.getAlertLog());

                // 새로운 알림이 생성될 때 SSE로 전송
                airport.domain.alertapi.AlertController alertController = airport.AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                alertController.sendNewAlert(alert);

                AlertSent alertSent = new AlertSent(alert);
                alertSent.publishAfterCommit();
            });
    }

    //>>> Clean Arch / Port Method
    

}
//>>> DDD / Aggregate Root
