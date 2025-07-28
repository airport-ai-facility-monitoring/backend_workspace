package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class EquipmentHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<Equipment>> {

    @Override
    public EntityModel<Equipment> process(EntityModel<Equipment> model) {
        return model;
    }
}
