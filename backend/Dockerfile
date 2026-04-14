FROM php:8.2-apache

# Activer le module de réécriture d'URL pour Symfony
RUN a2enmod rewrite

# Installer les extensions requises pour la base de données (Aiven MySQL) et Symfony
RUN apt-get update && apt-get install -y libicu-dev git unzip \
    && docker-php-ext-install pdo pdo_mysql intl

# Définir le dossier de travail
WORKDIR /var/www/html

# Copier les fichiers du backend dans le conteneur
COPY . .

# Définir le "Document Root" d'Apache vers le dossier public/ de Symfony
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer les dépendances Symfony de production
RUN composer install --no-dev --optimize-autoloader

# Donner les bonnes permissions aux dossiers de cache Symfony
RUN mkdir -p var/cache var/log
RUN chown -R www-data:www-data var/
