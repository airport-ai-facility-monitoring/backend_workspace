package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class StrangeObjectHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<StrangeObject>> {

    @Override
    public EntityModel<StrangeObject> process(
        EntityModel<StrangeObject> model
    ) {
        return model;
    }
}
