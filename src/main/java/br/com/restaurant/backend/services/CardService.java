package br.com.restaurant.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.restaurant.backend.entities.Cards;
import br.com.restaurant.backend.repository.CardRepository;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    public List<Cards> findAll() {
        return cardRepository.findAll();
    }

    public Optional<Cards> findById(String id) {
        return cardRepository.findById(id);
    }

    public Cards createCard(Cards cards) {
        return cardRepository.save(cards);
    }

    public Optional<Cards> updateCard(String id, Cards updatedCard) {
        return cardRepository.findById(id).map(card -> {
            card.setNumberCard(updatedCard.getNumberCard());
            card.setType(updatedCard.getType());
            card.setDueMonth(updatedCard.getDueMonth());
            card.setDueYear(updatedCard.getDueYear());
            card.setCvv(updatedCard.getCvv());

            return cardRepository.save(card);
        });
    }

    public boolean deleteCard(String id) {
        return cardRepository.findById(id).map(card -> {
            cardRepository.delete(card);
            return true;
        }).orElse(false);
    }
}