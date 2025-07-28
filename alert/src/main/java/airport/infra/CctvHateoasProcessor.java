package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class CctvHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<Cctv>> {

    @Override
    public EntityModel<Cctv> process(EntityModel<Cctv> model) {
        return model;
    }
}
