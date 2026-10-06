package com.example.demo.service;

import java.io.InputStream;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.UserContentDao;
import com.example.demo.dao.UserDao;
import com.example.demo.model.User;

import jakarta.annotation.PostConstruct;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;


@Service
public class UserService {
	
	private JasperReport jasperReport;

	@Autowired
	@Qualifier("UserContentDaoMyBatis")// UserContentDaoMyBatis / UserContentDaoJpa
	private UserContentDao userContentDao;
	
	@Autowired
	@Qualifier("UserDaoMyBatis") // UserDaoMyBatis / UserDaoJpa
	private UserDao userDao;
	
	private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initReport() throws Exception {

        try (InputStream reportStream =
                getClass().getResourceAsStream(
                        "/reports/JasperTest2.jasper"
                )) {

            jasperReport =
                    (JasperReport) JRLoader.loadObject(reportStream);
        }
    }
    
    @Transactional
    public void deleteAccount(String username) {
    		User user = userDao.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("找不到使用者"));

        userContentDao.deleteByUser_Id(user.getId());

        userDao.delete(user);
    }
	
	
	public List<User> getAll(){
		return userDao.findAll();
	}
	
	public User getByName(String username){
		System.out.println("===========getbyname===================");
		return userDao.findByUsername(username).orElse(null);
	}
	
//	public User login(String username, String password) {
//
//	    User user = userDao
//	            .findByUsername(username)
//	            .orElse(null);
//	    if (user == null) {
//	        return null;
//	    }
//	    if (!passwordEncoder.matches(password, user.getPassword())) {
//	        return null;
//	    }
//	    return user;
//	}
	
	@Transactional//因使用spring boot，不需自行寫begin / commit / rollback
	public List<User> registerAll(List<User> users) {
		System.out.println("----------register------");
		int i = 1;
		for(User user:users) {
			if (userDao.existsByUsername(user.getUsername())) {
				throw new RuntimeException("第" + i + "筆新增失敗");
		    }
		    
		    String encodedPassword = passwordEncoder.encode(user.getPassword());
		    user.setPassword(encodedPassword);
		    
		    userDao.save(user);
		    i++;
		}
		return users;
	}
	
	public User register(User user) {
		//System.out.println("----------register------");
	    if (userDao.existsByUsername(user.getUsername())) {
	        return null;
	    }
	    
	    String encodedPassword = passwordEncoder.encode(user.getPassword());
	    user.setPassword(encodedPassword);
	    
	    return userDao.save(user);
	}
	
	public byte[] createUserReport() throws Exception {

	    List<User> users = userDao.findAll();
	    JRBeanCollectionDataSource dataSource =
	            new JRBeanCollectionDataSource(users);

	    Map<String, Object> parameters = new HashMap<>();
	    parameters.put("title", "使用者資料報表");

	    JasperPrint jasperPrint =
	            JasperFillManager.fillReport(
	                    jasperReport,
	                    parameters,
	                    dataSource
	            );

	    return JasperExportManager.exportReportToPdf(jasperPrint);
	}
	
	public List<User> searchByUsername(String username, Integer page, Integer size){
		return userDao.searchByUsername(username, page, size);
	}
	
	public Long countByUsername(String username) {
		return userDao.countByUsername(username);
	}
	
}
