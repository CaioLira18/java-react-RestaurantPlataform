package br.com.restaurant.backend.entities;

import java.util.ArrayList;
import java.util.List;
import br.com.restaurant.backend.entities.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tb_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private UserRole role;
    private String name;
    private String email;
    private String cpf;
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "tb_user_cards", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "card_id"))
    List<Cards> cards = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "tb_user_carrrinho", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "carrrinho_id"))
    private List<Item> carrinho = new ArrayList<>();
}