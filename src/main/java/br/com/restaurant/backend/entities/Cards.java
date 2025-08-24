package br.com.restaurant.backend.entities;

import br.com.restaurant.backend.entities.enums.CardType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="UserCards")
public class Cards {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String id;
    
    private String numberCard;
    private String dueMonth;
    private String dueYear;
    private String cvv;
    private CardType type;
}
