package airport.domain.User;

import javax.persistence.*;
import java.time.Instant;
import lombok.Data;

@Entity
@Table(name = "password_reset_token", schema = "member")
@Data
public class PasswordResetToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 150)
    private String email;

    @Column(length = 6)
    private String code;

    private Instant expiresAt;

    private boolean used;

    private Integer attempts;

    private Instant createdAt = Instant.now();

    // getters/setters
}