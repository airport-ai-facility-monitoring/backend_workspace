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
@Table(name = "Alert_table")
@Data
//<<< DDD / Aggregate Root
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long alertId;

    private String alertLog;

    private Date alertDate;

    private Long cctvId;

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
                alert.setCctvId(dangerDetected.getCctvId());
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
                alert.setCctvId(workerCountExceeded.getCctvId());
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
                alert.setCctvId(workTimeNotMatched.getCctvId());
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
                alert.setCctvId(foreignObjectDetected.getCameraId());

                String objectType = foreignObjectDetected.getObjectType();
                String alertMessage;

                switch (objectType) {
                    case "5":
                    case "6":
                        alertMessage = "노면 손상 발생";
                        break;
                    case "7":
                        alertMessage = "FOD감지";
                        break;
                    case "8":
                        alertMessage = "조류 출현";
                        break;
                    case "9":
                        alertMessage = "동물 출현";
                        break;
                    default:
                        return; // 작업자 및 작업차량은 처리하지 않음
                }

                alert.setAlertLog(
                    "[" +
                    cctv.getCctvArea() +
                    "] " +
                    alertMessage
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
                alert.setCctvId(workNotInProgress.getCameraId());
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
