package com.example.demo.config;


import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtility {
	
	//private final SecretKey secretKey;
	private final PrivateKey privateKey;
	private final PublicKey publicKey;
    private final int accessValidSeconds;
    private final int refreshValidSeconds;
    private final JwtParser jwtParser;

    public JwtUtility(
    		//String secretKeyStr, 
    		String privateKeyStr,
        String publicKeyStr,
    		int accessValidSeconds, 
    		int refreshValidSeconds) throws Exception {
        //this.secretKey = Keys.hmacShaKeyFor(secretKeyStr.getBytes());
        //this.jwtParser = Jwts.parser().verifyWith(secretKey).build();
    		
    		// Private Key
        byte[] privateBytes = Base64.getDecoder().decode(privateKeyStr);
        PKCS8EncodedKeySpec privateSpec = new PKCS8EncodedKeySpec(privateBytes);

        // RSA KeyFactory
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        this.privateKey = keyFactory.generatePrivate(privateSpec);

        // Public Key
        byte[] publicBytes = Base64.getDecoder().decode(publicKeyStr);
        X509EncodedKeySpec publicSpec = new X509EncodedKeySpec(publicBytes);
        this.publicKey = keyFactory.generatePublic(publicSpec);
        
     // Public Key 負責驗證 JWT
        this.jwtParser = Jwts.parser().verifyWith(this.publicKey).build();
        
        this.accessValidSeconds = accessValidSeconds;
        this.refreshValidSeconds = refreshValidSeconds;
    }

    // =========================
    // Access Token
    // =========================
    public String createAccessToken(UserDetails user) {

        long expirationMillis =
                System.currentTimeMillis()
                + accessValidSeconds * 1000L;

        Claims claims = Jwts.claims()
                .issuedAt(new Date())
                .expiration(new Date(expirationMillis))
                .add(
                    "username",
                    user.getUsername()
                )
                .add(
                    "authorities",
                    user.getAuthorities()
                )
                .add(
                    "type",
                    "access"
                )
                .build();

        return Jwts.builder()
                .claims(claims)
                .signWith(privateKey)
                .compact();
    }


    // =========================
    // Refresh Token
    // =========================
    public String createRefreshToken(UserDetails user) {

        long expirationMillis =
                System.currentTimeMillis()
                + refreshValidSeconds * 1000L;

        Claims claims = Jwts.claims()
                .issuedAt(new Date())
                .expiration(new Date(expirationMillis))
                .add(
                    "username",
                    user.getUsername()
                )
                .add(
                    "type",
                    "refresh"
                )
                .build();

        return Jwts.builder()
                .claims(claims)
                .signWith(privateKey)
                .compact();
    }
    
    public Claims parseToken(String jwt) throws JwtException {
        return jwtParser.parseSignedClaims(jwt).getPayload();
    }
}