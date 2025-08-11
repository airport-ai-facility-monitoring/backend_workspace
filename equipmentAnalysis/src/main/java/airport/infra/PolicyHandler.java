// package airport.infra;

// import airport.config.kafka.KafkaProcessor;
// import airport.domain.*;
// import com.fasterxml.jackson.databind.DeserializationFeature;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import javax.naming.NameParser;
// import javax.naming.NameParser;
// import javax.transaction.Transactional;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.cloud.stream.annotation.StreamListener;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.stereotype.Service;

// //<<< Clean Arch / Inbound Adaptor
// @Service
// @Transactional
// public class PolicyHandler {

//     @Autowired
//     EquipmentReportRepository equipmentReportRepository;

//     @StreamListener(KafkaProcessor.INPUT)
//     public void whatever(@Payload String eventString) {}

//     @StreamListener(
//         value = KafkaProcessor.INPUT,
//         condition = "headers['type']=='EquipmentIAnalyRequested'"
//     )
//     public void wheneverEquipmentAnalyzeRequested(@Payload EquipmentIAnalyRequested event) {
//         if (!event.validate()) return;

//         System.out.println("##### [장비 분석 요청 수신됨] : " + event.toJson());

//         // 1. 수리 비용 예측 (임시 로직)
//         int predictedCost = PredictionService.predictCost(event.getEquipmentType());

//         // 2. LLM 보고서 생성 (임시 로직)
//         String reportContents = LlmService.generateReport(event.getEquipmentId(), predictedCost);

//         // 3. 보고서 저장
//         EquipmentReport report = new EquipmentReport();
//         report.setEquipmentId(event.getEquipmentId());
//         report.setTitle("장비 정기 점검 보고서");
//         report.setMaintenanceCost(predictedCost);
//         report.setReportContents(reportContents);
//         report.setState("보고서생성완료");

//         equipmentReportRepository.save(report);

//         // 4. 보고서 생성 이벤트 발행
//         ReportGenerated generated = new ReportGenerated(report);
//         generated.publishAfterCommit();
//     }
// }
// //>>> Clean Arch / Inbound Adaptor
