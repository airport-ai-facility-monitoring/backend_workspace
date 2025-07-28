package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class WorkTruckHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<WorkTruck>> {

    @Override
    public EntityModel<WorkTruck> process(EntityModel<WorkTruck> model) {
        return model;
    }
}
