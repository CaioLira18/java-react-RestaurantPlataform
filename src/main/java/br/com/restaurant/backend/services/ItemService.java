package br.com.restaurant.backend.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.restaurant.backend.entities.Item;
import br.com.restaurant.backend.repository.ItemRepository;


@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    public Optional<Item> findById(String id) {
        return itemRepository.findById(id);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Optional<Item> updateItem(String id, Item updatedItem) {
        return itemRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setPrice(updatedItem.getPrice());
            item.setDescription(updatedItem.getDescription());

            return itemRepository.save(item);
        });
    }

    public boolean deleteItem(String id) {
        return itemRepository.findById(id).map(item -> {
            itemRepository.delete(item);
            return true;
        }).orElse(false);
    }
}