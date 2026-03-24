export function CreditsFooter() {
  return (
    <footer className="credits" aria-label="Credits et licence">
      <p>
        Images de blasons issues du wiki de La Garde de Nuit. Contenu sous licence{' '}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
          Creative Commons BY-SA 4.0
        </a>{' '}
        sauf mention contraire.
      </p>
      <p>
        Source: {' '}
        <a
          href="https://lagardedenuit.com/wiki/index.php?title=Accueil"
          target="_blank"
          rel="noopener noreferrer"
        >
          La Garde de Nuit
        </a>
      </p>
    </footer>
  )
}
