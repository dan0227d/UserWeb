package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "usercontent")
public class UserContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "userid")
    @JsonIgnoreProperties("user")
    private User user;

    private Integer age;

    @Column(length = 45)
    private String email;

    @Column(length = 45)
    private String address;

    public UserContent() {
    }
    
    public UserContent(User user, Integer age, String email, String address) {
    	this.user=user;
    	this.age=age;
    	this.email=email;
    	this.address=address;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}