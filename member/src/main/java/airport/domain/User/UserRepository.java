package airport.domain.User;

import airport.domain.*;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


//<<< PoEAA / Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmployee(Employee employee);
}
