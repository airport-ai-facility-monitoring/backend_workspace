package airport.infra;

import airport.domain.*;
import airport.dto.*;
import java.util.*;
import javax.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.MediaType;
import java.time.LocalDateTime;

@RestController
@RequestMapping(value = "/api/equipments")
@Transactional
public class EquipmentController {

    @Autowired
    EquipmentRepository equipmentRepository;

    // ===================== UPDATE 장비 =====================
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public UnifiedEquipmentDto updateEquipment(@PathVariable Long id, @RequestBody EquipmentDto dto) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));

        equipment.setEquipmentName(dto.getEquipmentName());
        equipment.setEquipmentType(dto.getEquipmentType());
        equipment.setManufacturer(dto.getManufacturer());
        equipment.setProtectionRating(dto.getProtectionRating());
        equipment.setPurchase(dto.getPurchase());

        // // ✅ DTO(LocalDate) → 엔티티(LocalDateTime)로 저장
        // equipment.setPurchaseDate(
        //     dto.getPurchaseDate() != null ? dto.getPurchaseDate().atStartOfDay() : null
        // );
        equipment.setPurchaseDate(dto.getPurchaseDate());

        equipment.setServiceYears(dto.getServiceYears());
        equipment.setState(dto.getState());
        equipment.setFailure(dto.getFailure());
        equipment.setRuntime(dto.getRuntime());
        equipment.setRepairCost(dto.getRepairCost());
        equipment.setRepairTime(dto.getRepairTime());
        equipment.setLaborRate(dto.getLaborRate());
        equipment.setAvgLife(dto.getAvgLife());
        equipment.setMaintenanceCost(dto.getMaintenanceCost());

        Equipment saved = equipmentRepository.save(equipment);
        return convertToDto(saved);
    }

    // ===================== CREATE 장비 =====================
    @PostMapping("/lighting")
    public UnifiedEquipmentDto createLighting(@RequestBody CreateLightingRequest request) {
        Equipment equipment = convertToEntity(request.getEquipment());
        equipment.setEquipmentType("조명");

        LightingEquipmentDetail detail = new LightingEquipmentDetail();
        detail.setLampType(request.getLightingDetail().getLampType());
        detail.setPowerConsumption(request.getLightingDetail().getPowerConsumption());
        equipment.setLightingDetail(detail);

        Equipment savedEquipment = equipmentRepository.save(equipment);
        return convertToDto(savedEquipment);
    }

    @PostMapping("/weather")
    public UnifiedEquipmentDto createWeather(@RequestBody CreateWeatherRequest request) {
        Equipment equipment = convertToEntity(request.getEquipment());
        equipment.setEquipmentType("기상");

        WeatherEquipmentDetail detail = new WeatherEquipmentDetail();
        detail.setMountType(request.getWeatherDetail().getMountType());
        detail.setPowerConsumption(request.getWeatherDetail().getPowerConsumption());
        equipment.setWeatherDetail(detail);

        Equipment savedEquipment = equipmentRepository.save(equipment);
        return convertToDto(savedEquipment);
    }

    @PostMapping("/sign")
    public UnifiedEquipmentDto createSign(@RequestBody CreateSignRequest request) {
        Equipment equipment = convertToEntity(request.getEquipment());
        equipment.setEquipmentType("표지");

        SignEquipmentDetail detail = new SignEquipmentDetail();
        detail.setMaterial(request.getSignDetail().getMaterial());
        detail.setMountType(request.getSignDetail().getMountType());
        detail.setSignColor(request.getSignDetail().getSignColor());
        detail.setPanelWidth(request.getSignDetail().getPanelWidth());
        detail.setPanelHeight(request.getSignDetail().getPanelHeight());
        equipment.setSignDetail(detail);

        Equipment savedEquipment = equipmentRepository.save(equipment);
        return convertToDto(savedEquipment);
    }

    // ===================== READ =====================
    @GetMapping
    public List<UnifiedEquipmentDto> getAllEquipments() {
        List<UnifiedEquipmentDto> dtos = new ArrayList<>();
        for (Equipment equipment : equipmentRepository.findAll()) {
            dtos.add(convertToDto(equipment));
        }
        return dtos;
    }

    @GetMapping("/{id}")
    public UnifiedEquipmentDto getEquipmentById(@PathVariable Long id) {
        return equipmentRepository.findById(id)
            .map(this::convertToDto)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));
    }

    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentRepository.deleteById(id);
    }

    @PostMapping("/{id}/analyze")
    public void requestAnalysis(@PathVariable Long id) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));
        equipment.requestAnalysis();
        equipmentRepository.save(equipment);
    }

    // ===================== DTO =====================
    @Data
    public static class CreateLightingRequest {
        private EquipmentDto equipment;
        private LightingEquipmentDetailDto lightingDetail;
    }
    @Data
    public static class CreateWeatherRequest {
        private EquipmentDto equipment;
        private WeatherEquipmentDetailDto weatherDetail;
    }
    @Data
    public static class CreateSignRequest {
        private EquipmentDto equipment;
        private SignEquipmentDetailDto signDetail;
    }

    // ===================== Helper =====================
    private Equipment convertToEntity(EquipmentDto dto) {
        Equipment entity = new Equipment();
        entity.setEquipmentName(dto.getEquipmentName());
        entity.setState(dto.getState());
        entity.setCategory(dto.getCategory());
        entity.setManufacturer(dto.getManufacturer());
        entity.setProtectionRating(dto.getProtectionRating());
        entity.setPurchase(dto.getPurchase());

        // ✅ LocalDate → LocalDateTime
        // entity.setPurchaseDate(
        //     dto.getPurchaseDate() != null ? dto.getPurchaseDate().atStartOfDay() : null
        // );

        entity.setPurchaseDate(dto.getPurchaseDate());

        entity.setFailure(dto.getFailure());
        entity.setRuntime(dto.getRuntime());
        entity.setServiceYears(dto.getServiceYears());
        entity.setRepairCost(dto.getRepairCost());
        entity.setRepairTime(dto.getRepairTime());
        entity.setLaborRate(dto.getLaborRate());
        entity.setAvgLife(dto.getAvgLife());
        entity.setMaintenanceCost(dto.getMaintenanceCost());
        return entity;
    }

    private UnifiedEquipmentDto convertToDto(Equipment entity) {
        EquipmentDto commonDto = new EquipmentDto();
        commonDto.setEquipmentId(entity.getEquipmentId());
        commonDto.setEquipmentType(entity.getEquipmentType());
        commonDto.setEquipmentName(entity.getEquipmentName());
        commonDto.setState(entity.getState());
        commonDto.setCategory(entity.getCategory());
        commonDto.setManufacturer(entity.getManufacturer());
        commonDto.setProtectionRating(entity.getProtectionRating());
        commonDto.setPurchase(entity.getPurchase());
        commonDto.setPurchaseDate(entity.getPurchaseDate());
        commonDto.setFailure(entity.getFailure());
        commonDto.setRuntime(entity.getRuntime());
        commonDto.setServiceYears(entity.getServiceYears());
        commonDto.setRepairCost(entity.getRepairCost());
        commonDto.setRepairTime(entity.getRepairTime());
        commonDto.setLaborRate(entity.getLaborRate());
        commonDto.setAvgLife(entity.getAvgLife());
        commonDto.setMaintenanceCost(entity.getMaintenanceCost());

        UnifiedEquipmentDto unifiedDto = new UnifiedEquipmentDto();
        unifiedDto.setEquipment(commonDto);

        if (entity.getLightingDetail() != null) {
            LightingEquipmentDetail detailEntity = entity.getLightingDetail();
            LightingEquipmentDetailDto detailDto = new LightingEquipmentDetailDto();
            detailDto.setId(detailEntity.getId());
            detailDto.setLampType(detailEntity.getLampType());
            detailDto.setPowerConsumption(detailEntity.getPowerConsumption());
            unifiedDto.setLightingDetail(detailDto);
        }
        if (entity.getWeatherDetail() != null) {
            WeatherEquipmentDetail detailEntity = entity.getWeatherDetail();
            WeatherEquipmentDetailDto detailDto = new WeatherEquipmentDetailDto();
            detailDto.setId(detailEntity.getId());
            detailDto.setMountType(detailEntity.getMountType());
            detailDto.setPowerConsumption(detailEntity.getPowerConsumption());
            unifiedDto.setWeatherDetail(detailDto);
        }
        if (entity.getSignDetail() != null) {
            SignEquipmentDetail detailEntity = entity.getSignDetail();
            SignEquipmentDetailDto detailDto = new SignEquipmentDetailDto();
            detailDto.setId(detailEntity.getId());
            detailDto.setMaterial(detailEntity.getMaterial());
            detailDto.setMountType(detailEntity.getMountType());
            detailDto.setSignColor(detailEntity.getSignColor());
            detailDto.setPanelWidth(detailEntity.getPanelWidth());
            detailDto.setPanelHeight(detailEntity.getPanelHeight());
            unifiedDto.setSignDetail(detailDto);
        }
        return unifiedDto;
    }
}

