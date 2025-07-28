package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class RunwayCrackHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<RunwayCrack>> {

    @Override
    public EntityModel<RunwayCrack> process(EntityModel<RunwayCrack> model) {
        return model;
    }
}
