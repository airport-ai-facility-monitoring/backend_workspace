package airport.infra;

import airport.domain.*;
import airport.dto.*;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping(value = "/equipments")
@Transactional
public class EquipmentController {

    @Autowired
    EquipmentRepository equipmentRepository;

    // ====================================================================
    // Inner Classes for Create-Request DTOs
    // ====================================================================
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

    // ====================================================================
    // API Endpoints
    // ====================================================================

    // --- CREATE 장비 Endpoints ---
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
        equipment.setEquipmentType("표지판");

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

    // --- READ Endpoints ---
    @GetMapping
    public List<UnifiedEquipmentDto> getAllEquipments() {
        List<UnifiedEquipmentDto> dtos = new ArrayList<>();
        for (Equipment equipment : equipmentRepository.findAll()) {
            dtos.add(convertToDto(equipment));
        }
        return dtos;
    }

    // --- 장비 조회 ---
    @GetMapping("/{id}")
    public UnifiedEquipmentDto getEquipmentById(@PathVariable Long id) {
        return equipmentRepository.findById(id)
            .map(this::convertToDto)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));
    }

    // --- 장비 삭제 ---
    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable Long id) {
        equipmentRepository.deleteById(id);
    }

    // --- 장비 유지보수비용 분석 ---
    @PostMapping("/{id}/analyze")
    public void requestAnalysis(@PathVariable Long id) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));

        equipment.requestAnalysis();
        equipmentRepository.save(equipment);
    }

    // ====================================================================
    // Private Helper Methods
    // ====================================================================

    private Equipment convertToEntity(EquipmentDto dto) {
        Equipment entity = new Equipment();
        entity.setEquipmentName(dto.getEquipmentName());
        entity.setState(dto.getState());
        entity.setCategory(dto.getCategory());
        entity.setManufacturer(dto.getManufacturer());
        entity.setProtectionRating(dto.getProtectionRating());
        entity.setPurchase(dto.getPurchase());
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
        UnifiedEquipmentDto unifiedDto = new UnifiedEquipmentDto();

        // 1. 공통 정보를 EquipmentDto에 담기
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

        // 2. UnifiedEquipmentDto에 공통 DTO 설정
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