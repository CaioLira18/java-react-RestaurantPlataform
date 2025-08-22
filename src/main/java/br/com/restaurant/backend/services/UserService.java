package br.com.restaurant.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.restaurant.backend.entities.Item;
import br.com.restaurant.backend.entities.User;
import br.com.restaurant.backend.repository.ItemRepository;
import br.com.restaurant.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public Optional<User> updateUser(String id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setCpf(updatedUser.getCpf());
            user.setRole(updatedUser.getRole());

            if (!updatedUser.getPassword().equals(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            return userRepository.save(user);
        });
    }

    public boolean deleteUser(String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    public Optional<User> addItemToCart(String userId, String itemId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Item> itemOptional = itemRepository.findById(itemId);

        if (userOptional.isPresent() && itemOptional.isPresent()) {
            User user = userOptional.get();
            Item item = itemOptional.get();

            if (!user.getCarrinho().contains(item)) {
                user.getCarrinho().add(item);
                User savedUser = userRepository.save(user);
                return Optional.of(savedUser);
            }
        }

        return Optional.empty();
    }

    public Optional<User> removeItemFromCart(String userId, String itemId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Item> carrinho = user.getCarrinho(); // ou getItems(), dependendo do seu modelo
            
            System.out.println("📦 Carrinho antes da remoção: " + carrinho.size() + " itens");
            
            // Remove o item do carrinho baseado no ID
            boolean itemRemoved = carrinho.removeIf(item -> item.getId().equals(itemId));
            
            if (itemRemoved) {
                System.out.println("✅ Item removido com sucesso");
                System.out.println("📦 Carrinho após remoção: " + carrinho.size() + " itens");
                
                user.setCarrinho(carrinho);
                User savedUser = userRepository.save(user);
                return Optional.of(savedUser);
            } else {
                System.out.println("❌ Item não encontrado no carrinho");
                return Optional.of(user); // Retorna o usuário mesmo se o item não for encontrado
            }
        }
        
        System.out.println("❌ Usuário não encontrado");
        return Optional.empty();
    }
}