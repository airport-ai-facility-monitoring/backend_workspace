package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class AlertHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<Alert>> {

    @Override
    public EntityModel<Alert> process(EntityModel<Alert> model) {
        return model;
    }
}
