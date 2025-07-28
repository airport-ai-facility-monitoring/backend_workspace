package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class EquipmentReportHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<EquipmentReport>> {

    @Override
    public EntityModel<EquipmentReport> process(
        EntityModel<EquipmentReport> model
    ) {
        return model;
    }
}
