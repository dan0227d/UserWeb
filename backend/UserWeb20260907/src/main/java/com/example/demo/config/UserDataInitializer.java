package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Component
@Order(1)
public class UserDataInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        for (int i = 1; i <= 100; i++) {

            User user = new User();

            user.setUser("test" + i);
            user.setUsername("test" + i);

            // 所有人密碼都是 1234
            // 但資料庫存的是 BCrypt
            user.setPassword(
                    passwordEncoder.encode("1234")
            );

            userRepository.save(user);
        }

        System.out.println("User 初始資料建立完成");
    }
}