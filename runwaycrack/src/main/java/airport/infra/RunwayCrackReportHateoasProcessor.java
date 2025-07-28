package airport.infra;

import airport.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class RunwayCrackReportHateoasProcessor
    implements RepresentationModelProcessor<EntityModel<RunwayCrackReport>> {

    @Override
    public EntityModel<RunwayCrackReport> process(
        EntityModel<RunwayCrackReport> model
    ) {
        return model;
    }
}
