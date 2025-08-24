package br.com.restaurant.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.restaurant.backend.entities.Cards;

public interface CardRepository extends JpaRepository<Cards, String> {
    
}
