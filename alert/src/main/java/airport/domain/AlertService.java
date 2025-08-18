package airport.domain;

import airport.AlertApplication;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final CctvRepository cctvRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleForeignObject(ForeignObjectDetected evt) {
        Long cctvId = evt.getCameraId();
        System.out.println("[AlertSvc] ENTER FOD cctvId=" + cctvId + ", type=" + evt.getObjectType());
        if (cctvId == null) { System.out.println("[AlertSvc] cameraId null -> return"); return; }

        cctvRepository.findById(cctvId).ifPresentOrElse(cctv -> {
            String msg = mapFodType(String.valueOf(evt.getObjectType()));
            if (msg == null) { System.out.println("[AlertSvc] FOD ignored type=" + evt.getObjectType()); return; }

            Alert alert = new Alert();
            alert.setCctvId(cctvId);
            alert.setAlertLog("[" + cctv.getCctvArea() + "] " + msg);
            alert.setAlertDate(new Date());

            Alert saved = alertRepository.saveAndFlush(alert);
            System.out.println("[AlertSvc] SAVED alertId=" + saved.getAlertId());

            // SSE 전송은 롤백 유발 방지
            try {
                var ctrl = AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                ctrl.sendNewAlert(saved);
            } catch (Exception sseEx) {
                System.out.println("[AlertSvc] SSE error ignored: " + sseEx.getMessage());
            }

            new AlertSent(saved).publishAfterCommit();
        }, () -> System.out.println("[AlertSvc] CCTV NOT FOUND id=" + cctvId));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleWorkerCountExceeded(WorkerCountExceeded evt) {
        Long cctvId = evt.getCameraId();
        System.out.println("[AlertSvc] ENTER WCE cctvId=" + cctvId + ", count=" + evt.getWorkerCount() + ", limit=" + evt.getLimit());
        if (cctvId == null) { System.out.println("[AlertSvc] cameraId null -> return"); return; }

        cctvRepository.findById(cctvId).ifPresentOrElse(cctv -> {
            int over = evt.getWorkerCount() - evt.getLimit();
            Alert alert = new Alert();
            alert.setCctvId(cctvId);
            alert.setAlertLog("[" + cctv.getCctvArea() + "] 작업자 수 초과: " + evt.getWorkerCount() + "명 (" + over + "명 초과)");
            alert.setAlertDate(new Date());

            Alert saved = alertRepository.saveAndFlush(alert);
            System.out.println("[AlertSvc] SAVED alertId=" + saved.getAlertId());

            try {
                var ctrl = AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                ctrl.sendNewAlert(saved);
            } catch (Exception sseEx) {
                System.out.println("[AlertSvc] SSE error ignored: " + sseEx.getMessage());
            }

            new AlertSent(saved).publishAfterCommit();
        }, () -> System.out.println("[AlertSvc] CCTV NOT FOUND id=" + cctvId));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleWorkNotInProgress(WorkNotInProgress evt) {
        Long cctvId = evt.getCameraId();
        System.out.println("[AlertSvc] ENTER WNIP cctvId=" + cctvId + ", objType=" + evt.getObjectType());
        if (cctvId == null) { System.out.println("[AlertSvc] cameraId null -> return"); return; }

        cctvRepository.findById(cctvId).ifPresentOrElse(cctv -> {
            Alert alert = new Alert();
            alert.setCctvId(cctvId);
            alert.setAlertLog("[" + cctv.getCctvArea() + "] 비작업 시간 활동 감지: " + evt.getObjectType());
            alert.setAlertDate(new Date());

            Alert saved = alertRepository.saveAndFlush(alert);
            System.out.println("[AlertSvc] SAVED alertId=" + saved.getAlertId());

            try {
                var ctrl = AlertApplication.applicationContext.getBean(airport.domain.alertapi.AlertController.class);
                ctrl.sendNewAlert(saved);
            } catch (Exception sseEx) {
                System.out.println("[AlertSvc] SSE error ignored: " + sseEx.getMessage());
            }

            new AlertSent(saved).publishAfterCommit();
        }, () -> System.out.println("[AlertSvc] CCTV NOT FOUND id=" + cctvId));
    }

    private String mapFodType(String type) {
        switch (type) {
            case "5": case "6": return "노면 손상 발생";
            case "7": return "FOD감지";
            case "8": return "조류 출현";
            case "9": return "동물 출현";
            // 필요 시 확장:
            // case "11": return "기타 위험물 감지";
            default: return null;
        }
    }
}
