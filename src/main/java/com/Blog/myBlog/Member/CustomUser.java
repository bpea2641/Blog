package com.Blog.myBlog.Member;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class CustomUser extends User {
    String displayName;
    private Long id;

    public CustomUser(String username, String password, Collection<? extends GrantedAuthority> authorities, String displayName, Long id) {
        super(username, password == null ? "" : password, authorities);
        this.displayName = displayName;
        this.id = id;
    }

    public CustomUser(String username, String none, List<SimpleGrantedAuthority> authorities) {
        super(username, none, authorities);
    }
}
