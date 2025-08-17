package br.com.restaurant.backend.entities;

import br.com.restaurant.backend.entities.enums.ItemType;
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
@Table(name="tb_item")
public class Item {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String id;

    private String image;
    private String name;
    private String price;
    private String description;
    private ItemType type; 

}
