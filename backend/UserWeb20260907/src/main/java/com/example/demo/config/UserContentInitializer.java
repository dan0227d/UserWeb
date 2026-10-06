//package com.example.demo.config;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//
//import com.example.demo.model.User;
//import com.example.demo.model.UserContent;
//import com.example.demo.repository.UserContentRepository;
//import com.example.demo.repository.UserRepository;
//
//@Component
//@Order(2)
//public class UserContentInitializer implements CommandLineRunner {
//
//	private final UserRepository userRepository;
//    private final UserContentRepository usercontentRepository;
//
//    public UsercontentInitializer(
//            UserRepository userRepository,
//            UsercontentRepository usercontentRepository) {
//
//        this.userRepository = userRepository;
//        this.usercontentRepository = usercontentRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//
//        for (int i = 1; i <= 20; i++) {
//
//            User user = userRepository
//                    .findByUsername("test" + i)
//                    .orElse(null);
//
//            if (user == null) {
//                continue;
//            }
//
//            Usercontent content = new Usercontent();
//
//            content.setUser(user);
//            content.setAge(20 + i);
//            content.setEmail(
//                    "test" + i + "@example.com"
//            );
//            content.setAddress(
//                    "測試地址" + i
//            );
//
//            usercontentRepository.save(content);
//        }
//
//        System.out.println("Usercontent 初始資料建立完成");
//    }
//}



