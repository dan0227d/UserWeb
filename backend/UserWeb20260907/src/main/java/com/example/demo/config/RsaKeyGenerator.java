//package com.example.demo.config;
//
//import java.security.KeyPair;
//import java.security.KeyPairGenerator;
//import java.util.Base64;
//
//public class RsaKeyGenerator {
//
//    public static void main(String[] args) throws Exception {
//
//        // 1. 建立 RSA 金鑰產生器
//        KeyPairGenerator generator =
//                KeyPairGenerator.getInstance("RSA");
//
//        // 2. RSA 金鑰長度
//        generator.initialize(2048);
//
//        // 3. 產生一組 Public Key + Private Key
//        KeyPair keyPair = generator.generateKeyPair();
//
//        // 4. 取得兩把 Key
//        String privateKey = Base64.getEncoder()
//                .encodeToString(
//                        keyPair.getPrivate().getEncoded()
//                );
//
//        String publicKey = Base64.getEncoder()
//                .encodeToString(
//                        keyPair.getPublic().getEncoded()
//                );
//
//        // 5. 印出
//        System.out.println("Private Key:");
//        System.out.println(privateKey);
//
//        System.out.println();
//
//        System.out.println("Public Key:");
//        System.out.println(publicKey);
//    }
//}